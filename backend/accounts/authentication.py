from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import Token

class ExtendedTokenAuthentication(TokenAuthentication):
    model = Token