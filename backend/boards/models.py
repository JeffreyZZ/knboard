from adminsortable.fields import SortableForeignKey
from adminsortable.models import SortableMixin
from django.contrib.auth import get_user_model
from django.db import models
from model_utils.models import TimeStampedModel

User = get_user_model()


class Board(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="owned_boards"
    )
    members = models.ManyToManyField(User, related_name="boards")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        is_new = self.pk is None
        super().save(force_insert, force_update, using, update_fields)
        if is_new:
            self.members.add(self.owner)


class Column(SortableMixin):
    title = models.CharField(max_length=255)
    board = models.ForeignKey("Board", related_name="columns", on_delete=models.CASCADE)
    column_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)

    class Meta:
        ordering = ["column_order"]

    def __str__(self):
        return f"{self.title}"


class Label(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7)
    board = models.ForeignKey("Board", related_name="labels", on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "board"], name="unique_name_board")
        ]


class Priority(models.TextChoices):
    HIGH = "H", "High"
    MEDIUM = "M", "Medium"
    LOW = "L", "Low"

# merge boards_task into mc_question table
class Task(SortableMixin, TimeStampedModel):
    # mdclub
    question_id = models.BigAutoField(primary_key=True)  # Comment="问题ID"
    user_id = models.IntegerField()  # Comment="用户ID"
    content_markdown = models.TextField(null=True)  # Comment="原始的正文内容"
    content_rendered = models.TextField(null=True)  # Comment="过滤渲染后的正文内容"
    comment_count = models.PositiveIntegerField(default=0)  # Comment="评论数量"
    answer_count = models.PositiveIntegerField(default=0)  # Comment="回答数量"
    follower_count = models.PositiveIntegerField(default=0)  # Comment="关注者数量"
    vote_count = models.IntegerField(default=0)  # Comment="投票数，赞成票-反对票，可以为负数"
    vote_up_count = models.IntegerField(default=0)  # Comment="赞成票总数"
    vote_down_count = models.IntegerField(default=0)  # Comment="反对票总数"
    last_answer_time = models.PositiveIntegerField(default=0)  # Comment="最后回答时间"
    create_time = models.PositiveIntegerField(default=0)  # Comment="创建时间"
    update_time = models.PositiveIntegerField(default=0)  # Comment="更新时间"
    delete_time = models.PositiveIntegerField(default=0)  # Comment="删除时间"

    # shared
    title = models.CharField(max_length=80) #Comment="标题"
    
    # knboard
    priority = models.CharField(
        max_length=1, choices=Priority.choices, default=Priority.MEDIUM
    )
    labels = models.ManyToManyField(Label, related_name="tasks")
    assignees = models.ManyToManyField(User, related_name="tasks")
    column = SortableForeignKey(Column, related_name="tasks", on_delete=models.CASCADE)
    task_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)

    def __str__(self):
        return f"{self.question_id} - {self.title}"

    class Meta:
        db_table = "mc_question"
        ordering = ["task_order"]
        indexes = [
            models.Index(fields=['user_id', 'create_time', 'update_time', 'vote_count'])
        ]


class Note(SortableMixin, TimeStampedModel):
    content_markdown = models.TextField(null=True)  # Comment="原始的正文内容"
    content_rendered = models.TextField(null=True)  # Comment="过滤渲染后的正文内容"
    labels = models.ManyToManyField(Label, related_name="notes")
    column = SortableForeignKey(Column, related_name="notes", on_delete=models.CASCADE)
    #TODO: named as task_ is to be consistent with task.
    task_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)

    def __str__(self):
        return f"{self.id} - {self.content_rendered}"

    class Meta:
        ordering = ["task_order"]


class Comment(TimeStampedModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.PROTECT, related_name="comments")
    text = models.TextField()

    class Meta:
        ordering = ["created"]