from django.db import models
from base.models import Subject
# Create your models here.

class PDFText(models.Model):
    text_content = models.TextField(null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.text_content[:10]} - {self.subject.name}"
