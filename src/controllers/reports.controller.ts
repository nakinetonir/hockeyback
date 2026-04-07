import { Request, Response } from 'express';
import { env } from '../config/env.js';

type AnalysisRequestBody = {
  nombre?: string;
  tipo?: 'jugador' | 'portero';
  equipo?: string;
};

export async function getPlayerAnalysis(req: Request, res: Response) {
  const { nombre, tipo, equipo } = (req.body ?? {}) as AnalysisRequestBody;

  if (!nombre || !tipo || !equipo) {
    res.status(400).json({
      message: 'Los campos nombre, tipo y equipo son obligatorios'
    });
    return;
  }

  if (tipo !== 'jugador' && tipo !== 'portero') {
    res.status(400).json({
      message: 'El campo tipo debe ser "jugador" o "portero"'
    });
    return;
  }

  try {
    const response = await fetch(env.analysisWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, tipo, equipo })
    });

    const text = await response.text();

    if (!response.ok) {
      res.status(response.status).json({
        message: 'Error al consultar el workflow de análisis',
        details: text
      });
      return;
    }

    try {
      res.json(JSON.parse(text));
    } catch {
      res.json(text);
    }
  } catch (error) {
    res.status(502).json({
      message: 'No se pudo conectar con el workflow externo',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
