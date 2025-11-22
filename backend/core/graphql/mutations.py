import graphene
from graphql import GraphQLError
from core.models import Project, Task, CustomUser
from core.graphql.types import ProjectType, TaskType
from datetime import date
from core.graphql.auth import get_user_from_info






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
        user = get_user_from_info(info)
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
    

    # update project
    
class UpdateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        project_id = graphene.ID(required=True)
        name = graphene.String(required=False)
        description = graphene.String(required=False)

    def mutate(self, info, project_id, name=None, description=None):
        user = get_user_from_info(info)
        project = Project.objects.get(id=project_id)

        # Permission check: must be Manager or Creator
        if user.role != "Manager" and user != project.creator:
            raise GraphQLError("Only the project creator or a Manager can update the project.")
        
        if name is not None:
            project.name = name
        if description is not None:
            project.description = description

        project.save()
        return UpdateProject(project=project)

    # delete project
class DeleteProject(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        project_id = graphene.ID(required=True)

    def mutate(self, info, project_id):
        user = get_user_from_info(info)
        project = Project.objects.get(id=project_id)

        if user.role != "Manager" and user != project.creator:
            raise GraphQLError("Only the project creator or a Manager can delete this project.")

        project.delete()
        return DeleteProject(success=True)

    
    
    

        





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
        user =get_user_from_info(info)

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
        user =get_user_from_info(info)

        task = Task.objects.get(id=task_id)

        if task.assigned_to != user and user.role != "Manager":
            raise GraphQLError("You cannot update someone else's task")

        task.status = status
        task.save()

        return UpdateTaskStatus(task=task)
    

#task update

class UpdateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.ID(required=True)
        title = graphene.String(required=False)
        description = graphene.String(required=False)
        status = graphene.String(required=False)
        due_date = graphene.Date(required=False)

    def mutate(self, info, task_id, title=None, description=None, status=None, due_date=None):
        user = get_user_from_info(info)
        task = Task.objects.get(id=task_id)

        # Permissions: Only assigned user or Manager can update task
        if user != task.assigned_to and user.role != "Manager":
            raise GraphQLError("You cannot update a task that is not yours unless you are a Manager.")

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if status is not None:
            if status not in ["ToDo", "InProgress", "Done"]:
                raise GraphQLError("Invalid status value.")
            task.status = status
        if due_date is not None:
            task.due_date = due_date

        task.save()
        return UpdateTask(task=task)



# -----------------------------
# ASSIGN TASK TO USER
# -----------------------------
class AssignTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    def mutate(self, info, task_id, user_id):
        user =get_user_from_info(info)

        if user.role != "Manager":
            raise GraphQLError("Only managers can assign tasks")

        task = Task.objects.get(id=task_id)
        new_user = CustomUser.objects.get(id=user_id)

        task.assigned_to = new_user
        task.save()

        return AssignTask(task=task)
    

# dlete Task
class DeleteTask(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        task_id = graphene.ID(required=True)

    def mutate(self, info, task_id):
        user = get_user_from_info(info)
        task = Task.objects.get(id=task_id)

        if user.role != "Manager":
            raise GraphQLError("Only a Manager can delete tasks.")

        task.delete()
        return DeleteTask(success=True)






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
