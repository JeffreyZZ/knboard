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

    # exteneded properties to support mdclub
    answer_count = models.IntegerField(default=0)
    article_count = models.IntegerField(default=0)
    avatar_text = models.CharField(max_length=50,null=True)
    bio = models.CharField(max_length=160,null=True)
    blog = models.CharField(max_length=255,null=True)
    company = models.CharField(max_length=255,null=True)
    cover = models.CharField(max_length=50,null=True)
    create_ip = models.CharField(max_length=80,null=True)
    create_location = models.CharField(max_length=100,null=True)
    create_time = models.IntegerField(null=True)
    disable_time = models.IntegerField(null=True)
    followee_count = models.IntegerField(default=0)
    follower_count = models.IntegerField(default=0)
    following_article_count = models.IntegerField(default=0)  
    following_question_count = models.IntegerField(default=0) 
    following_topic_count = models.IntegerField(default=0)
    headline = models.CharField(max_length=40,default='') 
    inbox_unread = models.IntegerField(default=0)
    last_login_ip = models.CharField(max_length=80,null=True) 
    last_login_location = models.CharField(max_length=100,null=True) 
    last_login_time = models.IntegerField(null=True)
    location = models.CharField(max_length=255,null=True) 
    notification_unread = models.IntegerField(default=0)
    question_count = models.IntegerField(default=0)
    update_time = models.IntegerField(null=True)

    class Meta:
        ordering = ["-id"]


class Token(AuthToken):
    """
    The extended authorization token model to be compatible with mdclub
    """
    updated = models.DateTimeField(auto_now_add=True)
    expired = models.DateTimeField(auto_now_add=True)
    create_time = models.IntegerField(null=True)
    update_time = models.IntegerField(null=True)
    expire_time = models.IntegerField(null=True)
    device = models.CharField(max_length=600,null=True)
