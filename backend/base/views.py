from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Student,Subject,Notes ,Quiz, Flashcard
from llm.views import get_note, get_flashcard
from .serializers import StudentSerializer, LoginSerializer, SubjectSerializer, NotesSerializer, QuizSerializer, FlashcardSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils.decorators import method_decorator
from datetime import timedelta,datetime
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def UpdateStreakAPI(func): 
    def wrapper(request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            
            # Get or create the user's profile
            profile= Student.objects.get(user=user)
            # Get today's date and check the last streak update date
            today = datetime.now().date()
            last_activity_date = profile.last_activity_date

            if last_activity_date < today:  # Only update streak if it's a new day
                # If the user hasn't updated streak for today, reset streak if necessary
                
                if last_activity_date == today - timedelta(days=1):
                    profile.stats['streak'] = 1  # Reset streak if it's not consecutive days
                else:
                    profile.stats['streak'] += 1  # Increment streak for consecutive days
                
                # profile.last_activity_date = today
                profile.save()

        # Call the original view function
        return func(request, *args, **kwargs)
    return wrapper

class StudentAPI(APIView):
    # permission_classes=[IsAuthenticated]
    def get(self,request):
        subCode = request.GET.get("id", None)
        if not subCode:
            # print(1)
            # print(Student.objects.filter(user=request.user))
            # print(2)
            serializer = StudentSerializer(Student.objects.filter(user=request.user), many=True)
            # queryset=Subject.objects.all()

            # serializer= SubjectSerializer(queryset , many=True)
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
        print(request.user)
        try:
            student_obj = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found",
            }, status=404)
        if not subCode:
            queryset=Subject.objects.filter(user=student_obj)
            serializer= SubjectSerializer(queryset , many=True)
            return Response({
                "status": True,
                "data":serializer.data,
            })
        else:
            queryset=Subject.objects.get(id=subCode, user=student_obj)
            serializer= SubjectSerializer(queryset)
            return Response({
                "status": True,
                "data":serializer.data,
            })
        
    def post(self,request):
        data=request.data
        try:
            student_obj = Student.objects.get(user=request.user)
            data["user"] = student_obj.id
        except Student.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found",
            }, status=404)
        
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


@method_decorator(UpdateStreakAPI, name='dispatch')
class NotesAPI(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        subject_id = request.GET.get("id", None)
        try:
            student_obj = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found",
            }, status=404)
        if not subject_id:
            queryset = Notes.objects.filter(subject__user=student_obj)
            serializer = NotesSerializer(queryset, many=True)
            return Response({
                "status": True,
                "data": serializer.data,
            })
        else:
            try:
                subject = Subject.objects.get(id=subject_id, user=student_obj)
                if not subject.notes.exists():
                    notes = get_note(request)
                    

                    # Step 2: Parse the JSON string into a Python dictionary
                    notes_json = json.loads(notes.content)
                    noteObj = Notes.objects.create(subject=subject, content=notes_json['notes'])
                    return Response({
                        "status": True,
                        "data": NotesSerializer(noteObj).data,
                    })
                    
                serializer = NotesSerializer(subject.notes.all(), many=True)
                return Response({
                    "status": True,
                    "data": serializer.data,
                })
            except Subject.DoesNotExist:
                
                return Response({
                    "status": False,
                    "message": "Subject not found",
                }, status=404)

    def post(self, request):
        data = request.data
        try:
            student_obj = Student.objects.get(user=request.user)
            data["user"] = student_obj.id
        except Student.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found",
            }, status=404)
        serializer = NotesSerializer(data=data)
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
            note = Notes.objects.get(id=pk)
            serializer = NotesSerializer(note, data=request.data)
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
        except Notes.DoesNotExist:
            return Response({
                "status": False,
                "message": "Note not found",
            }, status=404)

    def delete(self, request, pk):
        try:
            note = Notes.objects.get(id=pk)
            note.delete()
            return Response({
                "status": True,
                "message": "Note deleted successfully",
            })
        except Notes.DoesNotExist:
            return Response({
                "status": False,
                "message": "Note not found",
            }, status=404)

@method_decorator(UpdateStreakAPI, name='dispatch')
class QuizAPI(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        quiz_id = request.GET.get("id", None)
        if not quiz_id:
            queryset = Quiz.objects.all()
            serializer = QuizSerializer(queryset, many=True)
            return Response({
                "status": True,
                "data": serializer.data,
            })
        else:
            try:
                quiz = Quiz.objects.get(id=quiz_id)
                serializer = QuizSerializer(quiz)
                return Response({
                    "status": True,
                    "data": serializer.data,
                })
            except Quiz.DoesNotExist:
                return Response({
                    "status": False,
                    "message": "Quiz not found",
                }, status=404)

    def post(self, request):
        data = request.data
        serializer = QuizSerializer(data=data)
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
            quiz = Quiz.objects.get(id=pk)
            serializer = QuizSerializer(quiz, data=request.data)
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
        except Quiz.DoesNotExist:
            return Response({
                "status": False,
                "message": "Quiz not found",
            }, status=404)

    def delete(self, request, pk):
        try:
            quiz = Quiz.objects.get(id=pk)
            quiz.delete()
            return Response({
                "status": True,
                "message": "Quiz deleted successfully",
            })
        except Quiz.DoesNotExist:
            return Response({
                "status": False,
                "message": "Quiz not found",
            }, status=404)

@method_decorator(UpdateStreakAPI, name='dispatch')
class FlashcardAPI(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        subject_id = request.GET.get("id", None)
        print(subject_id, request.user)
        try:
            student_obj = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found",
            }, status=404)
        if not subject_id:
            queryset = Flashcard.objects.filter(subject__user=student_obj)
            serializer = FlashcardSerializer(queryset, many=True)
            return Response({
                "status": True,
                "data": serializer.data,
            })
        else:
            try:
                subject = Subject.objects.get(id=subject_id, user=student_obj)
                if not subject.flashcards.exists():
                    flashcards = get_flashcard(request)
                
                    flashcard_json = json.loads(flashcards.content)
                    noteObj = Flashcard.objects.create(subject=subject, cards=flashcard_json['flashcards'])
                    return Response({
                        "status": True,
                        "data": NotesSerializer(noteObj).data,
                    })
                    
                serializer = FlashcardSerializer(subject.flashcards.all(), many=True)
                return Response({
                    "status": True,
                    "data": serializer.data,
                })
            except Subject.DoesNotExist:
                
                return Response({
                    "status": False,
                    "message": "Subject not found",
                }, status=404)
            
    def post(self, request):
        data = request.data
        try:
            student_obj = Student.objects.get(user=request.user)
            data["user"] = student_obj.id
        except Student.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found",
            }, status=404)
        serializer = FlashcardSerializer(data=data)
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
            flashcard = Flashcard.objects.get(id=pk)
            serializer = FlashcardSerializer(flashcard, data=request.data)
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
        except Flashcard.DoesNotExist:
            return Response({
                "status": False,
                "message": "Flashcard not found",
            }, status=404)

    def delete(self, request, pk):
        try:
            flashcard = Flashcard.objects.get(id=pk)
            flashcard.delete()
            return Response({
                "status": True,
                "message": "Flashcard deleted successfully",
            })
        except Flashcard.DoesNotExist:
            return Response({
                "status": False,
                "message": "Flashcard not found",
            }, status=404)

@method_decorator(UpdateStreakAPI, name='dispatch')
class QuizReportAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        try:
            student_obj = Student.objects.get(user=request.user)
            data["user"] = student_obj.id
        except Student.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found",
            }, status=404)
        
        # Get the quiz score and current date
        score = data.get("score", 0)
        today = datetime.now().strftime("%Y-%m-%d")

        # Get user stats
        user_stats = student_obj.stats or {"streak": 0, "session_time": {}, "avg_quiz_score": {}}
        
        # --- Update streak ---
        streak = user_stats.get("streak", 0)
        avg_quiz_score = user_stats.get("avg_quiz_score", {})

        # Check the last quiz date
        if avg_quiz_score:
            last_quiz_date = max(avg_quiz_score.keys())
            last_quiz_date_obj = datetime.strptime(last_quiz_date, "%Y-%m-%d")

            # Increment streak if the quiz is taken on the next day
            if (last_quiz_date_obj + timedelta(days=1)).strftime("%Y-%m-%d") == today:
                streak += 1
            else:
                streak = 1  # Reset streak
        else:
            streak = 1  # First quiz attempt

        user_stats["streak"] = streak

        # --- Update average quiz score ---
        if today not in avg_quiz_score:
            # Initialize today's score stats
            avg_quiz_score[today] = {"score": 0, "total": 0, "average": 0}

        avg_quiz_score_today = avg_quiz_score[today]
        avg_quiz_score_today["score"] += score
        avg_quiz_score_today["total"] += 1
        avg_quiz_score_today["average"] = avg_quiz_score_today["score"] / avg_quiz_score_today["total"]

        user_stats["avg_quiz_score"] = avg_quiz_score

        # --- Save updated stats back to the database ---
        student_obj.stats = user_stats
        student_obj.save()

        return Response({
            "status": True,
            "message": "Quiz stats updated successfully",
            "stats": user_stats,
        }, status=200)
        
@csrf_exempt
def generate_study_plan(request):
    pass

def home(request):
    return HttpResponse("HOME PAGE")
