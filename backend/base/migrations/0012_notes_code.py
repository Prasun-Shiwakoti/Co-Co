# Generated by Django 5.1.2 on 2024-11-30 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0011_remove_quiz_code_alter_subject_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='notes',
            name='code',
            field=models.CharField(default='DEFAULT', max_length=10),
        ),
    ]
