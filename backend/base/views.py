from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Student
from .serializers import StudentSerializer, LoginSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


# Create your views here.

class StudentAPI(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        print(request.GET)
        queryset=Student.objects.all()
        serializer=StudentSerializer(queryset , many=True)
        return Response({
            "status": True,
            "data":serializer.data,
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

def home(request):
    return HttpResponse("HOME PAGE")
