# Generated by Django 3.2 on 2021-05-02 04:03

import adminsortable.fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('members', models.ManyToManyField(related_name='boards', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='owned_boards', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Column',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('column_order', models.PositiveIntegerField(db_index=True, default=0, editable=False)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='columns', to='boards.board')),
            ],
            options={
                'ordering': ['column_order'],
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('color', models.CharField(max_length=7)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='labels', to='boards.board')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('question_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('user_id', models.PositiveIntegerField()),
                ('content_markdown', models.TextField(null=True)),
                ('content_rendered', models.TextField(null=True)),
                ('comment_count', models.PositiveIntegerField(default=0)),
                ('answer_count', models.PositiveIntegerField(default=0)),
                ('follower_count', models.PositiveIntegerField(default=0)),
                ('vote_count', models.IntegerField(default=0)),
                ('vote_up_count', models.PositiveIntegerField(default=0)),
                ('vote_down_count', models.PositiveIntegerField(default=0)),
                ('last_answer_time', models.PositiveIntegerField(default=0)),
                ('create_time', models.PositiveIntegerField(default=0)),
                ('update_time', models.PositiveIntegerField(default=0)),
                ('delete_time', models.PositiveIntegerField(default=0)),
                ('title', models.CharField(max_length=80)),
                ('description', models.TextField(blank=True)),
                ('priority', models.CharField(choices=[('H', 'High'), ('M', 'Medium'), ('L', 'Low')], default='M', max_length=1)),
                ('task_order', models.PositiveIntegerField(db_index=True, default=0, editable=False)),
                ('assignees', models.ManyToManyField(related_name='tasks', to=settings.AUTH_USER_MODEL)),
                ('column', adminsortable.fields.SortableForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='boards.column')),
                ('labels', models.ManyToManyField(related_name='tasks', to='boards.Label')),
            ],
            options={
                'db_table': 'mc_question',
                'ordering': ['task_order'],
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('text', models.TextField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='comments', to=settings.AUTH_USER_MODEL)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='boards.task')),
            ],
            options={
                'ordering': ['created'],
            },
        ),
        migrations.AddIndex(
            model_name='task',
            index=models.Index(fields=['user_id', 'create_time', 'update_time', 'vote_count'], name='mc_question_user_id_ac737d_idx'),
        ),
        migrations.AddConstraint(
            model_name='label',
            constraint=models.UniqueConstraint(fields=('name', 'board'), name='unique_name_board'),
        ),
    ]
