from rest_framework import serializers
from .models import Student,Subject

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
    pass

class ChapterSerializer(serializers.ModelSerializer):
    pass

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
