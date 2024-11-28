from rest_framework import serializers
from .models import Student,Subject,Chapter

class StudentSerializer(serializers.ModelSerializer):
    subjects = serializers.SerializerMethodField()
    class Meta:
        model=Student
        fields="__all__"

    def get_subjects(self, obj):
        # Return the subjects related to this student
        subjects = Subject.objects.filter(user=obj)
        return SubjectSerializer(subjects, many=True).data
    
class SubjectSerializer(serializers.ModelSerializer):
    chapters = serializers.SerializerMethodField()
    class Meta:
        model=Subject
        fields="__all__"

    def get_chapters(self, obj):
        # Return the chapters related to this subject
        chapters = Chapter.objects.filter(subject=obj)
        return ChapterSerializer(chapters, many=True).data
    

class ChapterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Chapter
        fields = "__all__"

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
