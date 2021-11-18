# Generated by Django 3.2.7 on 2021-11-16 05:17

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator(), django.core.validators.MinLengthValidator(3)], verbose_name='username')),
                ('is_guest', models.BooleanField(default=False)),
                ('answer_count', models.IntegerField(default=0)),
                ('article_count', models.IntegerField(default=0)),
                ('avatar_text', models.CharField(max_length=50, null=True)),
                ('bio', models.CharField(default='', max_length=160)),
                ('blog', models.CharField(default='', max_length=255)),
                ('company', models.CharField(default='', max_length=255)),
                ('cover', models.CharField(default='', max_length=50)),
                ('create_ip', models.CharField(max_length=80, null=True)),
                ('create_location', models.CharField(max_length=100, null=True)),
                ('create_time', models.IntegerField(null=True)),
                ('disable_time', models.IntegerField(default=0)),
                ('followee_count', models.IntegerField(default=0)),
                ('follower_count', models.IntegerField(default=0)),
                ('following_article_count', models.IntegerField(default=0)),
                ('following_question_count', models.IntegerField(default=0)),
                ('following_topic_count', models.IntegerField(default=0)),
                ('headline', models.CharField(default='', max_length=40)),
                ('inbox_unread', models.IntegerField(default=0)),
                ('last_login_ip', models.CharField(max_length=80, null=True)),
                ('last_login_location', models.CharField(max_length=100, null=True)),
                ('last_login_time', models.IntegerField(null=True)),
                ('location', models.CharField(max_length=255, null=True)),
                ('notification_unread', models.IntegerField(default=0)),
                ('question_count', models.IntegerField(default=0)),
                ('update_time', models.IntegerField(null=True)),
            ],
            options={
                'ordering': ['-id'],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Avatar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to='avatars')),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('key', models.CharField(max_length=40, primary_key=True, serialize=False, verbose_name='Key')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created')),
                ('updated', models.DateTimeField(auto_now_add=True)),
                ('expired', models.DateTimeField(auto_now_add=True)),
                ('create_time', models.IntegerField(null=True)),
                ('update_time', models.IntegerField(null=True)),
                ('expire_time', models.IntegerField(null=True)),
                ('device', models.CharField(max_length=600, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='auth_token', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Token',
                'verbose_name_plural': 'Tokens',
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='accounts.avatar'),
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]
