CREATE TABLE "Rol" (
  "id" serial PRIMARY KEY,
  "nombre" varchar(50) UNIQUE,
  "descripcion" text
);

CREATE TABLE "Usuario" (
  "id" serial PRIMARY KEY,
  "username" varchar(150) UNIQUE,
  "password" varchar(128),
  "email" varchar(254) UNIQUE,
  "first_name" varchar(150),
  "last_name" varchar(150),
  "rol_id" int
);

CREATE TABLE "Mentor" (
  "id" serial PRIMARY KEY,
  "user_id" int,
  "cargo" varchar(20),
  "telefono" varchar(255),
  "nivel_conocimientos" varchar(50),
  "url_foto" varchar(255),
  "url_certificado" varchar(255)
);

CREATE TABLE "Proyecto" (
  "id" serial PRIMARY KEY,
  "nombre" varchar(100),
  "esta_activo" boolean
);

CREATE TABLE "Horarios" (
  "id" serial PRIMARY KEY,
  "dia_semana" varchar(20),
  "hora_inicio" time,
  "hora_fin" time
);

CREATE TABLE "DisponibilidadMentor" (
  "id" serial PRIMARY KEY,
  "mentor_id" int,
  "horario_id" int
);

CREATE TABLE "Grupo" (
  "id" serial PRIMARY KEY,
  "proyecto_id" int,
  "mentor_id" int,
  "horario_id" int,
  "modalidad" varchar(20),
  "espacio" varchar(255),
  "fecha_inicio" date,
  "fecha_final" date
);

CREATE TABLE "Evento" (
  "id" serial PRIMARY KEY,
  "grupo_id" int,
  "espacio" varchar(255),
  "fecha" date,
  "hora_inicio" time,
  "hora_fin" time
);

CREATE TABLE "AsistenciaMentor" (
  "id" serial PRIMARY KEY,
  "mentor_id" int,
  "registrado_por" int,
  "horas" numeric(4,2),
  "fecha" date
);

CREATE TABLE "Conocimiento" (
  "id" serial PRIMARY KEY,
  "nivel" varchar(20),
  "descripcion" varchar(100),
  "area" varchar(100)
);

CREATE TABLE "Usuario_Conocimiento" (
  "id" serial PRIMARY KEY,
  "usuario_id" int,
  "conocimiento_id" int
);

CREATE TABLE "Archivo" (
  "id" serial PRIMARY KEY,
  "usuario_id" int,
  "descripcion" text,
  "titulo" varchar(100),
  "archivo" varchar(255),
  "fecha_subida" timestamp
);

CREATE TABLE "Metrica" (
  "id" serial PRIMARY KEY,
  "proyectos_en_curso" int,
  "total_mentores" int,
  "total_horas" numeric(8,2)
);

ALTER TABLE "Usuario" ADD FOREIGN KEY ("rol_id") REFERENCES "Rol" ("id");

ALTER TABLE "Mentor" ADD FOREIGN KEY ("user_id") REFERENCES "Usuario" ("id");

ALTER TABLE "DisponibilidadMentor" ADD FOREIGN KEY ("mentor_id") REFERENCES "Mentor" ("id");

ALTER TABLE "DisponibilidadMentor" ADD FOREIGN KEY ("horario_id") REFERENCES "Horarios" ("id");

ALTER TABLE "Grupo" ADD FOREIGN KEY ("proyecto_id") REFERENCES "Proyecto" ("id");

ALTER TABLE "Grupo" ADD FOREIGN KEY ("mentor_id") REFERENCES "Mentor" ("id");

ALTER TABLE "Grupo" ADD FOREIGN KEY ("horario_id") REFERENCES "Horarios" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("grupo_id") REFERENCES "Grupo" ("id");

ALTER TABLE "AsistenciaMentor" ADD FOREIGN KEY ("mentor_id") REFERENCES "Mentor" ("id");

ALTER TABLE "AsistenciaMentor" ADD FOREIGN KEY ("registrado_por") REFERENCES "Usuario" ("id");

ALTER TABLE "Usuario_Conocimiento" ADD FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Usuario_Conocimiento" ADD FOREIGN KEY ("conocimiento_id") REFERENCES "Conocimiento" ("id");

ALTER TABLE "Archivo" ADD FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id");
