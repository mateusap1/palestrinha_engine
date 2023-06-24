import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { IUsuario, IUsuarioRegistrar, IUsuarioLogin } from "../interfaces";
import { AppError } from "../errors/AppError";
import { Usuario } from "../schemas";


const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  return hashedPassword;
};

const userIfExists = async (email: string) => {
  const user = await prisma.usuario.findUnique({
    where: { email: email },
  });

  return user;
};

export const loginService = async (data: IUsuarioLogin) => {
  try {
    const user = await userIfExists(data.email);

    if (!user) {
      throw new AppError("Email or password invalid", 403);
    }

    const passwordMatch = await bcrypt.compare(data.senha, user.senha);

    if (!passwordMatch) {
      throw new AppError("Email or password invalid", 403);
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET_KEY as string,
      {
        subject: String(user.id),
        expiresIn: "24h",
      }
    );

    return { token };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const registerUserService = async (
  dataBody: IUsuarioRegistrar
): Promise<IUsuario> => {
  const { subAreasInteresse, email } = dataBody;

  try {
    // Verificar se o email ou matricula já está cadastrado
    const existingUser = await userIfExists(email);

    if (existingUser) {
      throw new AppError("Email já cadastrado", 400);
    }

    // Verificar se a matrícula já está cadastrada
    const existingMatricula = await prisma.usuario.findUnique({
      where: { matricula: dataBody.matricula },
    });

    if (existingMatricula) {
      throw new AppError("Matrícula já cadastrada", 400);
    }

    // Encontrar departamento
    const departamento = await prisma.departamento.findUnique({
      where: { nome: dataBody.departamento },
    });

    if (!departamento) {
      throw new AppError("Departamento não encontrado", 400);
    }

    // Obter as IDs das sub-áreas de interesse
    const subAreas = await prisma.subArea.findMany({
      where: { nome: { in: subAreasInteresse } },
    });

    // Criar o usuário com as informações fornecidas
    const createUser = await prisma.usuario.create({
      data: {
        nome: dataBody.nome,
        email: dataBody.email,
        senha: await hashPassword(dataBody.senha),
        matricula: dataBody.matricula,
        departamentoId: departamento.id,
        tipo: dataBody.tipoUsuario,
        subAreasInteresse: {
          connect: subAreas.map((subArea) => ({ id: subArea.id })),
        },
      },
      include: {
        subAreasInteresse: true,
      },
    });

    return Usuario.parse(createUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};
