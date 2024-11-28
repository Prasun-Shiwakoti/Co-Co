from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Student,Subject,Chapter
from .serializers import StudentSerializer, LoginSerializer, SubjectSerializer, ChapterSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


# Create your views here.

class StudentAPI(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        subCode = request.GET.get("id", None)
        if not subCode:
            queryset=Subject.objects.all()
            serializer= SubjectSerializer(queryset , many=True)
            return Response({
                "status": True,
                "data":serializer.data,
            })
        else:
            queryset=Subject.objects.get(id=subCode)
            serializer= SubjectSerializer(queryset)
            return Response({
                "status": True,
                "data":serializer.data,
            })
    
    def post(self,request):
        data=request.data
        serializer=StudentSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.data)
            return Response({
                "status":False,
                "data":serializer.errors
            })
        serializer.save()
        return Response({
            "status":True,
            "data":serializer.data
        })


class LoginAPI(APIView):
    def post(self,request):
        data=request.data
        serializer=LoginSerializer(data=data)
        if not serializer.is_valid():
            return Response({
                    "status":False,
                    "data":serializer.errors
            })
        username=serializer.data['username']
        password=serializer.data['password']
        
        user_obj=authenticate(username=username, password=password)

        if user_obj:
            token,_=Token.objects.get_or_create(user=user_obj)
            return Response({
                "status": True,
                "data":{"token":str(token)},
            })
        else:
            return Response({
                "status": False,
                "data":{},
                "message":"INVALID CREDENTIALS",
            })

class SubjectAPI(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        subCode = request.GET.get("id", None)
        if not subCode:
            queryset=Subject.objects.all()
            serializer= SubjectSerializer(queryset , many=True)
            return Response({
                "status": True,
                "data":serializer.data,
            })
        else:
            queryset=Subject.objects.get(id=subCode)
            serializer= SubjectSerializer(queryset)
            return Response({
                "status": True,
                "data":serializer.data,
            })
        
    def post(self,request):
        data=request.data
        serializer=SubjectSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.data)
            return Response({
                "status":False,
                "data":serializer.errors
            })
        serializer.save()
        return Response({
            "status":True,
            "data":serializer.data
        })

class ChapterAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chapter_id = request.GET.get("id", None)
        if not chapter_id:
            queryset = Chapter.objects.all()
            serializer = ChapterSerializer(queryset, many=True)
            return Response({
                "status": True,
                "data": serializer.data,
            })
        else:
            try:
                chapter = Chapter.objects.get(id=chapter_id)
                serializer = ChapterSerializer(chapter)
                return Response({
                    "status": True,
                    "data": serializer.data,
                })
            except Chapter.DoesNotExist:
                return Response({
                    "status": False,
                    "message": "Chapter not found",
                }, status=404)

    def post(self, request):
        data = request.data
        serializer = ChapterSerializer(data=data)
        if not serializer.is_valid():
            return Response({
                "status": False,
                "data": serializer.errors,
            })
        serializer.save()
        return Response({
            "status": True,
            "data": serializer.data,
        })
    
    def put(self, request, pk):
        try:
            chapter = Chapter.objects.get(id=pk)
            serializer = ChapterSerializer(chapter, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "status": True,
                    "data": serializer.data,
                })
            return Response({
                "status": False,
                "data": serializer.errors,
            })
        except Chapter.DoesNotExist:
            return Response({
                "status": False,
                "message": "Chapter not found",
            }, status=404)

    def delete(self, request, pk):
        try:
            chapter = Chapter.objects.get(id=pk)
            chapter.delete()
            return Response({
                "status": True,
                "message": "Chapter deleted successfully",
            })
        except Chapter.DoesNotExist:
            return Response({
                "status": False,
                "message": "Chapter not found",
            }, status=404)

def home(request):
    return HttpResponse("HOME PAGE")
