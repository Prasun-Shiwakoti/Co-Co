from django.db import models
from base.models import Subject
# Create your models here.

class UploadedPDF(models.Model):
    file = models.FileField(upload_to='pdfs/')
    text_content = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.file.name} - {self.subject.name}"
