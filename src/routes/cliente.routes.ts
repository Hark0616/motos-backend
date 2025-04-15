import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Crear cliente
router.post("/", async (req, res) => {
  const { nombre, cedula, telefono, correo, rol } = req.body;

  try {
    const cliente = await prisma.cliente.create({
      data: { nombre, cedula, telefono, correo, rol },
    });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ error: "No se pudo crear el cliente", detalle: error });
  }
});

// Listar todos los clientes
router.get("/", async (req, res) => {
  const clientes = await prisma.cliente.findMany();
  res.json(clientes);
});

export default router;
