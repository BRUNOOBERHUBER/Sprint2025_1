from fastapi import Header, HTTPException, status, Depends

from typing import Optional

TOKEN_HEADER_NAME = "X-API-TOKEN"
TOKEN_FIXO = "secure-token"


async def validar_token(x_api_token: Optional[str] = Header(None, alias=TOKEN_HEADER_NAME)):
    if x_api_token != TOKEN_FIXO:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou ausente") 