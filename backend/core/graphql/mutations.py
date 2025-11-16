import graphene
from graphql import GraphQLError
from core.models import Project, Task, CustomUser
from core.graphql.types import ProjectType, TaskType
from datetime import date


# -----------------------------
# Helper: get logged-in user
# -----------------------------
def get_user(info):
    user = info.context.user
    if user.is_anonymous:
        raise GraphQLError("Authentication required")
    return user


# -----------------------------
# CREATE PROJECT
# -----------------------------

class CreateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        start_date = graphene.Date(required=True)
        end_date = graphene.Date(required=True)

    def mutate(self, info, name, description, start_date, end_date):
        user = get_user(info)

        if user.role != "Manager":
            raise GraphQLError("Only managers can create projects")

        project = Project.objects.create(
            name=name,
            description=description,
            start_date=start_date,
            end_date=end_date,
            creator=user,
        )

        return CreateProject(project=project)


# -----------------------------
# CREATE TASK
# -----------------------------
class CreateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        assigned_to = graphene.ID(required=True)
        project = graphene.ID(required=True)
        due_date = graphene.Date(required=True)

    def mutate(self, info, title, description, assigned_to, project, due_date):
        user = get_user(info)

        if user.role != "Manager":
            raise GraphQLError("Only managers can create tasks")

        assigned_user = CustomUser.objects.get(id=assigned_to)
        project_obj = Project.objects.get(id=project)

        task = Task.objects.create(
            title=title,
            description=description,
            assigned_to=assigned_user,
            project=project_obj,
            due_date=due_date,
        )

        return CreateTask(task=task)


# -----------------------------
# UPDATE TASK STATUS
# -----------------------------
class UpdateTaskStatus(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    def mutate(self, info, task_id, status):
        user = get_user(info)

        task = Task.objects.get(id=task_id)

        if task.assigned_to != user and user.role != "Manager":
            raise GraphQLError("You cannot update someone else's task")

        task.status = status
        task.save()

        return UpdateTaskStatus(task=task)


# -----------------------------
# ASSIGN TASK TO USER
# -----------------------------
class AssignTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    def mutate(self, info, task_id, user_id):
        user = get_user(info)

        if user.role != "Manager":
            raise GraphQLError("Only managers can assign tasks")

        task = Task.objects.get(id=task_id)
        new_user = CustomUser.objects.get(id=user_id)

        task.assigned_to = new_user
        task.save()

        return AssignTask(task=task)
    


import graphene
from graphql import GraphQLError
from django.contrib.auth import authenticate
from core.models import CustomUser
from core.utils.jwt import generate_jwt

class LoginMutation(graphene.Mutation):
    token = graphene.String()
    user_id = graphene.ID()
    username = graphene.String()
    role = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if not user:
            raise GraphQLError("Invalid credentials")
        token = generate_jwt(user)
        return LoginMutation(
            token=token, 
            user_id=user.id, 
            username=user.username, 
            role=user.role
        )



# -----------------------------
# ROOT MUTATION
# -----------------------------
class Mutation(graphene.ObjectType):
    login = LoginMutation.Field()
    create_project = CreateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
    assign_task = AssignTask.Field()
