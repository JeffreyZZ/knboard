import binascii
import os

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UnicodeUsernameValidator
from django.core.validators import MinLengthValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token as AuthToken


class Avatar(models.Model):
    photo = models.ImageField(upload_to="avatars")

    def __str__(self):
        return os.path.basename(self.photo.name)


class User(AbstractUser):
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[UnicodeUsernameValidator(), MinLengthValidator(3)],
        error_messages={"unique": _("A user with that username already exists."),},
    )
    avatar = models.ForeignKey(
        "Avatar", null=True, blank=True, on_delete=models.PROTECT
    )
    is_guest = models.BooleanField(default=False)

    class Meta:
        ordering = ["-id"]


class Token(AuthToken):
    """
    The default authorization token model.
    """
    updated = models.DateTimeField(_("Updated"), auto_now_add=True)
