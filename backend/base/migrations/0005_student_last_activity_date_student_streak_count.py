# Generated by Django 5.1.1 on 2024-11-28 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_flashcard_quiz'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='last_activity_date',
            field=models.DateField(auto_now=True),
        ),
        migrations.AddField(
            model_name='student',
            name='streak_count',
            field=models.IntegerField(default=0),
        ),
    ]
