import datetime
import pytz
from django.utils import timezone

def custom_create_token(token_model, user, serializer):
    utc_now = timezone.now().replace(tzinfo=pytz.utc)
    # create token if not exist or get it if it exists
    # created indicates whether it's newly created
    # reference : https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication
    token, created = token_model.objects.get_or_create(user=user)
    if created:
        token.created = utc_now
        token.updated = utc_now
        token.expired = utc_now
        token.create_time = token.created.timestamp()
        token.update_time = token.updated.timestamp()
        token.expire_time = token.expired.timestamp()
        token.save()
    return token