from django.db import models

# Create your models here.

class Todo(models.Model):
    text = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.text
    