# Generated by Django 5.1.2 on 2024-11-29 14:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_rename_chapter_flashcard_subject_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='flashcard',
            name='code',
        ),
    ]
