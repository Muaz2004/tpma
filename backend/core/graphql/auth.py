# backend/core/graphql/auth.py
from graphql import GraphQLError
from core.utils.jwt import decode_jwt
from core.models import CustomUser

def get_user_from_info(info):
    """
    Read Authorization header from info.context.META,
    decode token and return CustomUser instance.
    Raises GraphQLError on failure.
    """
    auth_header = info.context.META.get("HTTP_AUTHORIZATION") or info.context.META.get("Authorization")
    if not auth_header:
        raise GraphQLError("Authentication credentials were not provided. Add header: Authorization: Bearer <token>")

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise GraphQLError("Invalid Authorization header. Use: Bearer <token>")

    token = parts[1]
    user_id = decode_jwt(token)
    if not user_id:
        raise GraphQLError("Invalid or expired token")

    try:
        return CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        raise GraphQLError("User not found")
