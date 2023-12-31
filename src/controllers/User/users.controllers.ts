import { Request, Response } from "express";
import {
  loginService,
  registerUserService,
} from "../../services/user/usuario.service";
import { getAllUsersService } from "../../services/user/getAllUsers.service";
import { IUsuarioUpdate } from "../../interfaces";
import { updateUserService } from "../../services/user/updateUser.service";
import { getUserByIDService } from "../../services/user/getUserByID.service";
import { deleteUserService } from "../../services/user/deleteUser.service";
import { getUserEventsService } from "../../services/user/getUserEvents.service";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    const result = await loginService({ email, senha });

    // Return o token
    res.json(result);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const result = await registerUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to recover users" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const userData = req.body;

    const updatedUser = await updateUserService(userId, userData);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({
      error: "Failed to update user",
    });
  }
};

export const getUserByIDController = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    const retrivedUser = await getUserByIDService(userId);

    return res.status(201).json(retrivedUser);
  } catch (error) {
    console.error("Erro ao tentar recuperar o usuário:", error);
    return res.status(500).json({
      error: "Failed to retrieve user",
    });
  }
};

export const getUserEventsController = async (req: Request, res: Response) => {
  try {
    interface QueryParams {
      page: string;
      count: string;
    }

    // Access the query parameters and perform type-checking
    const queryParams: QueryParams = req.query as unknown as QueryParams;
    const { page, count } = queryParams;

    const userEmail = req.params.email;

    const retrivedUser = await getUserEventsService(
      userEmail,
      parseInt(page),
      parseInt(count)
    );

    return res.status(201).json(retrivedUser);
  } catch (error) {
    console.error("Erro ao tentar recuperar o usuário:", error);
    return res.status(500).json({
      error: "Failed to retrieve user",
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const deletedEvent = await deleteUserService(id);
  return res.status(204).json(deletedEvent);
};
