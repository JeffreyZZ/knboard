# Generated by Django 3.2.7 on 2022-01-03 03:13

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
            ],
            options={
                'ordering': ['column_order'],
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('text', models.TextField()),
            ],
            options={
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('title', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to='images')),
            ],
            options={
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('color', models.CharField(max_length=7)),
            ],
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('task_order', models.PositiveIntegerField(db_index=True, default=0, editable=False)),
                ('coverid', models.IntegerField(blank=True, null=True)),
                ('content_markdown', models.TextField(null=True)),
                ('content_rendered', models.TextField(null=True)),
            ],
            options={
                'ordering': ['task_order'],
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('task_order', models.PositiveIntegerField(db_index=True, default=0, editable=False)),
                ('coverid', models.IntegerField(blank=True, null=True)),
                ('question_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('user_id', models.IntegerField()),
                ('content_markdown', models.TextField(null=True)),
                ('content_rendered', models.TextField(null=True)),
                ('comment_count', models.PositiveIntegerField(default=0)),
                ('answer_count', models.PositiveIntegerField(default=0)),
                ('follower_count', models.PositiveIntegerField(default=0)),
                ('vote_count', models.IntegerField(default=0)),
                ('vote_up_count', models.IntegerField(default=0)),
                ('vote_down_count', models.IntegerField(default=0)),
                ('last_answer_time', models.PositiveIntegerField(default=0)),
                ('create_time', models.PositiveIntegerField(default=0)),
                ('update_time', models.PositiveIntegerField(default=0)),
                ('delete_time', models.PositiveIntegerField(default=0)),
                ('title', models.CharField(max_length=80)),
                ('priority', models.CharField(choices=[('H', 'High'), ('M', 'Medium'), ('L', 'Low')], default='M', max_length=1)),
            ],
            options={
                'db_table': 'question',
                'ordering': ['task_order'],
            },
        ),
        migrations.CreateModel(
            name='QuestionComment',
            fields=[
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('comment_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('commentable_id', models.IntegerField()),
                ('commentable_type', models.CharField(max_length=11)),
                ('user_id', models.IntegerField()),
                ('content', models.TextField()),
                ('reply_count', models.IntegerField(default=0)),
                ('vote_count', models.IntegerField(default=0)),
                ('vote_up_count', models.IntegerField(default=0)),
                ('vote_down_count', models.IntegerField(default=0)),
                ('create_time', models.PositiveIntegerField(default=0)),
                ('update_time', models.PositiveIntegerField(default=0)),
                ('delete_time', models.PositiveIntegerField(default=0)),
            ],
            options={
                'db_table': 'comment',
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('task_order', models.PositiveIntegerField(db_index=True, default=0, editable=False)),
                ('coverid', models.IntegerField(blank=True, null=True)),
                ('user_id', models.IntegerField()),
                ('content_markdown', models.TextField(null=True)),
                ('content_rendered', models.TextField(null=True)),
                ('comment_count', models.PositiveIntegerField(default=0)),
                ('answer_count', models.PositiveIntegerField(default=0)),
                ('follower_count', models.PositiveIntegerField(default=0)),
                ('vote_count', models.IntegerField(default=0)),
                ('vote_up_count', models.IntegerField(default=0)),
                ('vote_down_count', models.IntegerField(default=0)),
                ('last_answer_time', models.PositiveIntegerField(default=0)),
                ('create_time', models.PositiveIntegerField(default=0)),
                ('update_time', models.PositiveIntegerField(default=0)),
                ('delete_time', models.PositiveIntegerField(default=0)),
                ('title', models.CharField(max_length=80)),
                ('priority', models.CharField(choices=[('H', 'High'), ('M', 'Medium'), ('L', 'Low')], default='M', max_length=1)),
                ('assignees', models.ManyToManyField(related_name='tasks', to=settings.AUTH_USER_MODEL)),
                ('column', adminsortable.fields.SortableForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='boards.column')),
                ('labels', models.ManyToManyField(related_name='tasks', to='boards.Label')),
            ],
            options={
                'ordering': ['task_order'],
            },
        ),
        migrations.AddIndex(
            model_name='questioncomment',
            index=models.Index(fields=['user_id', 'create_time', 'update_time', 'vote_count'], name='comment_user_id_6298a6_idx'),
        ),
        migrations.AddField(
            model_name='question',
            name='assignees',
            field=models.ManyToManyField(related_name='questions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='question',
            name='column',
            field=adminsortable.fields.SortableForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='boards.column'),
        ),
        migrations.AddField(
            model_name='question',
            name='labels',
            field=models.ManyToManyField(related_name='question', to='boards.Label'),
        ),
        migrations.AddField(
            model_name='note',
            name='column',
            field=adminsortable.fields.SortableForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='boards.column'),
        ),
        migrations.AddField(
            model_name='note',
            name='labels',
            field=models.ManyToManyField(related_name='notes', to='boards.Label'),
        ),
        migrations.AddField(
            model_name='label',
            name='board',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='labels', to='boards.board'),
        ),
        migrations.AddField(
            model_name='image',
            name='note',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='boards.note'),
        ),
        migrations.AddField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='comments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='comment',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='boards.task'),
        ),
        migrations.AddField(
            model_name='column',
            name='board',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='columns', to='boards.board'),
        ),
        migrations.AddField(
            model_name='board',
            name='members',
            field=models.ManyToManyField(related_name='boards', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='board',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='owned_boards', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddIndex(
            model_name='task',
            index=models.Index(fields=['user_id', 'create_time', 'update_time', 'vote_count'], name='boards_task_user_id_f3e292_idx'),
        ),
        migrations.AddIndex(
            model_name='question',
            index=models.Index(fields=['user_id', 'create_time', 'update_time', 'vote_count'], name='question_user_id_550448_idx'),
        ),
        migrations.AddConstraint(
            model_name='label',
            constraint=models.UniqueConstraint(fields=('name', 'board'), name='unique_name_board'),
        ),
    ]
