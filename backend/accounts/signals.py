from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver

@receiver(user_logged_in)
def log_user_logged_in_success(sender, user, request, **kwargs):
    """
    Called by django when user_logged_in signal is triggered. 
    Use this callback to write login data in database.
    """
    user.last_login_time = user.last_login.timestamp()
    user.last_login_ip = get_client_ip(request)
    user.location = request.META.get('HTTP_USER_AGENT', '<unknown>')[:255]
    user.save()

@receiver(user_login_failed)
def log_user_logged_in_failed(sender, user, request, **kwargs):
    """
    Called by django when user_login_failed signal is triggered
    """
    user_agent_info = request.META.get('HTTP_USER_AGENT', '<unknown>')[:255],

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip