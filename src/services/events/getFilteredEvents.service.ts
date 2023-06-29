import { PrismaClient } from "@prisma/client";
import { TipoEvento } from "@prisma/client";

const prisma = new PrismaClient();

export const getFilteredEvents = async (
  page: number,
  count: number,
  nome?: string,
  tipo?: TipoEvento,
  dataInicio?: Date,
  dataFim?: Date,
  departamento?: string,
  subAreasRelacionadas?: string[]
) => {
  try {
    const events = await prisma.evento.findMany({
      skip: count * (page - 1),
      take: count,
      where: {
        ...(nome ? { nome: { contains: nome } } : {}),
        ...(tipo ? { tipoEvento: tipo } : {}),
        ...(dataInicio ? { dataInicio: { gte: dataInicio } } : {}),
        ...(dataFim ? { dataFim: { lte: dataFim } } : {}),
        ...(departamento ? { departamento: { nome: departamento } } : {}),
        ...(subAreasRelacionadas
          ? {
              AND: subAreasRelacionadas.map((subArea) => ({
                subAreasRelacionadas: {
                  some: {
                    tabelaId: subArea,
                  },
                },
              })),
            }
          : {}),
      },
      include: {
        criador: true,
        departamento: true,
        subAreasRelacionadas: true,
        eventoMaior: true,
        eventosMenores: true,
      },
    });

    return events;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
