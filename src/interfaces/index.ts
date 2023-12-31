import { TipoUsuario, TipoEvento } from "@prisma/client";

// ========================== Usuários ==========================

export interface IUsuarioLogin {
  email: string;
  senha: string;
}

export enum ITipoUsuario {
  Tecnico,
  Docente,
  Graduacao,
  PosGraduacao,
}

export interface IUsuarioRegistrar {
  nome: string;
  email: string;
  senha: string;
  matricula: string;
  departamento: string;
  tipoUsuario: TipoUsuario;
  subAreasInteresse: string[];
}

export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  matricula: string;
  departamento: string;
  tipoUsuario: TipoUsuario;
  subAreasInteresse: string[];
}

export interface IUsuarioUpdate {
  nome?: string;
  email?: string;
  senha?: string;
  subAreasInteresse?: string[];
}

// ==============================================================

// ======================== Tabela CAPES ========================

export interface IMacroArea {
  id: number;
  nome: string;
  areas: Area[];
}

export interface Area {
  id: number;
  nome: string;
  macroArea: IMacroArea;
  subAreas: SubArea[];
}

export interface SubArea {
  id: number;
  nome: string;
  area: Area;
}

// ==============================================================

// =========================== Eventos ==========================

export interface IEvento {
  nome: string;
  descricao: string;
  tipoEvento: TipoEvento;
  urlMaisInfo?: string;
  urlInscricao?: string;
  criadorEmail: string;
  eventoMaiorId?: string;
  departamentoNome: string;
  dataInicio: string;
  dataFim: string;
  subAreasRelacionadas: string[];
}

export interface IEventoUpdate {
  departamentoId?: undefined;
  nome?: string;
  descricao?: string;
  tipoEvento?: TipoEvento;
  urlMaisInfo?: string;
  urlInscricao?: string;
  criadorEmail?: string;
  eventoMaiorId?: string;
  departamentoNome?: string;
  dataInicio?: Date;
  dataFim?: Date;
  subAreasRelacionadas?: SubArea[];
}

// ==============================================================
