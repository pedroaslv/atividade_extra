from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import AvisoEntrada, AvisoSaida

app = FastAPI(title="Mural de Avisos Acadêmicos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)

avisos = []


@app.get("/api/avisos", response_model=list[AvisoSaida])
def listar_avisos():
    return avisos


@app.post("/api/avisos", response_model=AvisoSaida, status_code=201)
def publicar_aviso(dados: AvisoEntrada):
    aviso = dados.model_dump()
    aviso["id"] = len(avisos) + 1
    aviso["publicado_em"] = datetime.now()
    avisos.append(aviso)
    return aviso
