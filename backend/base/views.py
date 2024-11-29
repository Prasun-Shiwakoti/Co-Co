import json 
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Student, Subject, Notes, Quiz, Flashcard

from .serializers import (
    StudentSerializer,
    LoginSerializer,
    SubjectSerializer,
    NotesSerializer,
    QuizSerializer,
    FlashcardSerializer,
)

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from llm.views import get_note, get_flashcard

from datetime import timedelta, datetime

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
            try:
                queryset=Subject.objects.get(id=subCode, user=student_obj)
                serializer= SubjectSerializer(queryset)
                return Response({
                    "status": True,
                    "data":serializer.data,
                })
            except:
                return Response({
                    "status": False,
                    "message": "Subject or User not found",
                }, status=404)
        
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
                    falshcardObj = Flashcard.objects.create(subject=subject, cards=flashcard_json['flashcards'])
                    return Response({
                        "status": True,
                        "data": FlashcardSerializer(falshcardObj).data,
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
        avg_quiz_score = user_stats.get("avg_quiz_score", {})

        # Check the last quiz date
        if avg_quiz_score:
            last_quiz_date = max(avg_quiz_score.keys())
            last_quiz_date_obj = datetime.strptime(last_quiz_date, "%Y-%m-%d")

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

@method_decorator(UpdateStreakAPI, name='dispatch')
class SessionTimeAPI(APIView):
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
        session_time = data.get("session_time", 0)
        today = datetime.now().strftime("%Y-%m-%d")

        # Get user stats
        user_stats = student_obj.stats or {"streak": 0, "session_time": {}, "avg_quiz_score": {}}
        
        # --- Update streak ---
        session_time_json = user_stats.get("session_time", {})
        # Check the last quiz date

        # --- Update average quiz score ---
        if today not in session_time_json:
            # Initialize today's score stats
            session_time_json[today] = session_time
        else:
            session_time_json[today] += session_time
        
        user_stats["session_time"] = session_time
        print(user_stats)
        # --- Save updated stats back to the database ---
        student_obj.stats = user_stats
        student_obj.save()
        print("Saved")
        return Response({
            "status": True,
            "message": "Quiz stats updated successfully",
            "stats": user_stats,
        }, status=200)



def generate_study_plan(exam_schedule, priorities, spare_days, min_hours=2, max_hours=5, min_subjects=2, max_subjects=None):
    """
    Generate a study plan for subjects based on priorities, exam order, and spare days.
    
    :param exam_schedule: List of subject names in order of exams
    :param priorities: List of priority values (in hours)
    :param spare_days: Total number of days available for study
    :param min_hours: Minimum study hours per day
    :param max_hours: Maximum study hours per day
    :param min_subjects: Minimum number of subjects to study per day
    :param max_subjects: Maximum number of subjects to study per day (None for no limit)
    :return: Study plan as a list of daily plans
    """
    # Ensure we have enough spare days
    if spare_days < 1:
        raise ValueError("Spare days must be at least 1")
    
    # Normalize priorities if needed
    if len(priorities) != len(exam_schedule):
        priorities = [1] * len(exam_schedule)
    
    # Calculate days until exam for each subject, with safety for fewer spare days
    days_until_exam = [max(1, spare_days - i) for i in range(len(exam_schedule))]
    
    # Adjust priorities based on days until exam
    # Subjects with closer exams get higher weight
    adjusted_priorities = [
        (p * (1 + ((spare_days+len(exam_schedule)) - d + 1)/(spare_days+len(exam_schedule)))) 
        for p, d in zip(priorities, range(spare_days, spare_days+len(priorities)+1))
    ]
    
    # Calculate hours needed per subject based on adjusted priorities
    total_priority = sum(adjusted_priorities)
    total_available_hours = spare_days * max_hours
    hour_per_subject = [
        (p * total_available_hours) / total_priority 
        for p in adjusted_priorities
    ]

    # Create a list of subjects with required hours and days until exam
    subjects = [
        {
            "sub": exam_schedule[i],
            "hours": hour_per_subject[i],
            "days_left": days_until_exam[i],
            "daily_min": hour_per_subject[i] / spare_days  # Minimum hours needed per day
        } 
        for i in range(len(exam_schedule))
    ]
    # Initialize study plan
    study_plan = [[] for _ in range(spare_days)]
    
    # Process each day
    for day in range(spare_days):
        remaining_hours = max_hours  # Start with max hours for the day
        daily_subjects_count = 0
        
        # Update days left and sort subjects
        for subject in subjects:
            subject['days_left'] = max(0, subject['days_left'] - 1)
        
        # Sort subjects by (1) days left and (2) remaining hours (descending)
        subjects.sort(key=lambda x: (x['days_left'], -x['hours']))
        
        # Prepare to select subjects from the end (last-first manner)
        available_subjects = subjects.copy()
        
        # Allocate subjects for the day
        while (remaining_hours > 0 and 
               available_subjects and 
               (max_subjects is None or daily_subjects_count < max_subjects) and 
               daily_subjects_count < min_subjects):
            
            # Get the most urgent subject from the end
            current_subject = available_subjects.pop()
            
            # Calculate hours to allocate today
            if current_subject['days_left'] > 0:
                hours_today = min(
                    remaining_hours,
                    current_subject['hours'] / current_subject['days_left'],
                    max_hours - sum(task.get('duration', 0) for task in study_plan[day])
                )
            else:
                # If it's the last day for this subject
                hours_today = min(
                    remaining_hours,
                    current_subject['hours'],
                    # max_hours - sum(task.get('duration', 0) for task in study_plan[day])
                )
            
            # We apply this to ensure student reads for a minimum of `min`(1) hours
            if hours_today < min_hours/2:
                continue
                
            # Add to daily plan
            study_plan[day].append({
                "sub": current_subject['sub'],
                "duration": round(hours_today, 2)
            })
            
            # Update remaining hours and subject hours
            remaining_hours -= hours_today
            current_subject['hours'] -= hours_today
            daily_subjects_count += 1
            
            # Remove subject if completed
            if current_subject['hours'] <= 0:
                subjects = [s for s in subjects if s['sub'] != current_subject['sub']]
            else:
                # Put the subject back in the original list
                subjects.append(current_subject)
                # Re-sort the list
                subjects.sort(key=lambda x: (x['days_left'], -x['hours']))

    return study_plan

    
@csrf_exempt
def generate_study_plan_api(request):
    # Example usage
    print("Generating study plan...")
    if request.method == 'POST':
        data = json.loads(request.body)
        exam_subjects = data.get("subjects", None)
        spare_days = data.get("daysBeforeExam", None)
        if not (exam_subjects and spare_days):
            return JsonResponse({
                "status": False,
                "message": "Invalid request. Please provide exam_schedule and spare_days in the request body.",
            }, status=400)
        exam_schedule = []
        priorities = []
        try:
            for subject in exam_subjects:
                exam_schedule.append(subject['name'])
                priorities.append(int(subject['priority']))
        except Exception as e:
            print("Error", e)
            return JsonResponse({
                "status": False,
                "message": "Invalid request. Please provide valid exam_schedule and priorities in the request body.",
            }, status=400)

        study_plan = generate_study_plan(
            exam_schedule, 
            priorities, 
            spare_days, 
            min_subjects=2,  
            max_subjects=3   
        )
        return JsonResponse({
            "status": True,
            "data": study_plan,
        }, status=200)
    return JsonResponse({
        "status": False,
        "message": "Invalid request method. Please use POST method to generate study plan.",
    }, status=400)

def home(request):
    return HttpResponse("HOME PAGE")
