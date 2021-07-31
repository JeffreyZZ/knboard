import datetime
import pytz
from django.utils import timezone

def custom_create_token(token_model, user, serializer):
    token = token_model.objects.create(user=user)
    utc_now = timezone.now()
    utc_now = utc_now.replace(tzinfo=pytz.utc)
    token.created = utc_now
    token.updated = utc_now
    token.expired = utc_now
    token.create_time = token.created.timestamp()
    token.updated_time = token.updated.timestamp()
    token.expire_time = token.expired.timestamp()
    token.save()
    return token