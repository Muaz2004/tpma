import graphene
from graphql import GraphQLError
from core.models import Project, Task, CustomUser
from core.graphql.types import ProjectType, TaskType, UserType
from datetime import date
from core.graphql.auth import get_user_from_info
from django.contrib.auth import authenticate
from core.utils.jwt import generate_jwt

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
        status = graphene.String() 

    def mutate(self, info, name, description, start_date, end_date,status):
        user = get_user_from_info(info)
        if user.role != "Manager":
            raise GraphQLError("Only managers can create projects")

        project = Project.objects.create(
            name=name,
            description=description,
            start_date=start_date,
            end_date=end_date,
            creator=user,
            status=status,
        )

        return CreateProject(project=project)
    
# -----------------------------
# UPDATE PROJECT
# -----------------------------
class UpdateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        project_id = graphene.ID(required=True)
        name = graphene.String(required=False)
        description = graphene.String(required=False)
        status = graphene.String(required=False)
        start_date = graphene.Date(required=True)
        end_date = graphene.Date(required=True)

    def mutate(
        self,
        info,
        project_id,
        name=None,
        description=None,
        status=None,
        start_date=None,
        end_date=None
    ):
        user = get_user_from_info(info)

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise GraphQLError("Project not found")

        # Permission check
        if user.role != "Manager" or user != project.creator:
            raise GraphQLError("Not authorized to update this project")

        # Update fields
        if name is not None:
            project.name = name

        if description is not None:
            project.description = description

        if status is not None:
            allowed_status = [
                "Not Started",
                "In Progress",
                "Completed",
                "On Hold",
                "Cancelled",
            ]
            if status.title() not in allowed_status:
                raise GraphQLError("Invalid status value.")
            project.status = status.title()

        if start_date is not None:
            project.start_date = start_date

        if end_date is not None:
            project.end_date = end_date

        project.save()
        return UpdateProject(project=project)

# -----------------------------
# DELETE PROJECT
# -----------------------------
class DeleteProject(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        project_id = graphene.ID(required=True)

    def mutate(self, info, project_id):
        user = get_user_from_info(info)
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise GraphQLError("Project not found")

        if user.role != "Manager" or user != project.creator:
            raise GraphQLError("Only the project creator or a Manager can delete this project.")

        project.delete()
        return DeleteProject(success=True)
    


# -----------------------------
# UPDATE PROJECT STATUS
# -----------------------------
class UpdateProjectStatus(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        project_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    def mutate(self, info, project_id, status):
        user = get_user_from_info(info)
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise GraphQLError("Project not found")

        # Only Managers or project creator can update status
        if user.role != "Manager" and user != project.creator:
            raise GraphQLError("You cannot update the status of this project.")

        # Case-insensitive validation
        allowed_status = ["not started", "in progress", "completed", "on hold", "cancelled"]
        if status.lower() not in allowed_status:
            raise GraphQLError("Invalid status value.")

        # Store with proper capitalization
        proper_status = next(s.title() for s in allowed_status if s == status.lower())
        project.status = proper_status
        project.save()

        return UpdateProjectStatus(project=project)


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
        user = get_user_from_info(info)

        # Only managers can create tasks
        if user.role != "Manager":
            raise GraphQLError("Only managers can create tasks")

        # Find the assigned user
        try:
            assigned_user = CustomUser.objects.get(id=assigned_to)
        except CustomUser.DoesNotExist:
            raise GraphQLError("Assigned user not found")

        # Find the project and check if the current user is the creator
        try:
            project_obj = Project.objects.get(id=project)
        except Project.DoesNotExist:
            raise GraphQLError("Project not found")

        if project_obj.creator != user:
            raise GraphQLError("You can only assign tasks to projects you created")

        # Create the task
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
        user = get_user_from_info(info)

        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise GraphQLError("Task not found")

        # Permission check

        if user != task.assigned_to and user != task.project.creator:
            raise GraphQLError("You cannot update this task unless you are the assignee or project creator.")


        # Correct ENUM validation based on your Task model
        allowed_status = ["ToDo", "InProgress", "Done"]
        if status not in allowed_status:
            raise GraphQLError(
                f"Invalid status. Allowed values: {allowed_status}"
            )

        task.status = status
        task.save()

        return UpdateTaskStatus(task=task)




# -----------------------------
# UPDATE TASK
# -----------------------------
class UpdateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    def mutate(self, info, task_id, title=None, description=None, status=None, due_date=None):
        user = get_user_from_info(info)
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise GraphQLError("Task not found")

        if user != task.project.creator:
            raise GraphQLError("Only the project creator can update this task.")



        if title:
            task.title = title
        if description:
            task.description = description
        if status:
            allowed_status = ["ToDo", "InProgress", "Done"]
            if status not in allowed_status:
                raise GraphQLError(f"Invalid status. Allowed values: {allowed_status}")
            task.status = status
        if due_date:
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
        user = get_user_from_info(info)

        # 1️⃣ Get task FIRST
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise GraphQLError("Task not found")

        # 2️⃣ Permission check AFTER task exists
        if user != task.project.creator:
            raise GraphQLError(
                "Only the project creator can assign tasks in this project."
            )

        # 3️⃣ Get user to assign
        try:
            new_user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise GraphQLError("User not found")

        # 4️⃣ Assign and save
        task.assigned_to = new_user
        task.save()

        return AssignTask(task=task)


# -----------------------------
# DELETE TASK
# -----------------------------
class DeleteTask(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        task_id = graphene.ID(required=True)

    def mutate(self, info, task_id):
        user = get_user_from_info(info)
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise GraphQLError("Task not found")

        if user != task.project.creator:
            raise GraphQLError("Only the project creator can delete tasks in this project.")


        task.delete()
        return DeleteTask(success=True)

# -----------------------------
# LOGIN
# -----------------------------


class LoginMutation(graphene.Mutation):
    token = graphene.String()
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if not user:
            raise GraphQLError("Invalid credentials")
        token = generate_jwt(user)
        return LoginMutation(token=token, user=user)

    


# -----------------------------
# REGISTER
# -----------------------------


class RegisterMutation(graphene.Mutation):
    token = graphene.String()
    user = graphene.Field(UserType)

    class Arguments:
        first_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, first_name, email, password):
        if CustomUser.objects.filter(email=email).exists():
            raise GraphQLError("Email already exists")

        user = CustomUser(
            username=email,#here it is i will change it later just i will make the usernam using first name just email is too much for some one who wants to login........
            email=email,
            first_name=first_name,
            role="USER"
        )
        user.set_password(password)
        user.save()
        token = generate_jwt(user)
        return RegisterMutation(token=token, user=user)
    


# -----------------------------
# ROOT MUTATION
# -----------------------------
class Mutation(graphene.ObjectType):
    login = LoginMutation.Field()
    register = RegisterMutation.Field()

    # Project Mutations
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()
    UpdateProjectStatus=UpdateProjectStatus.Field()

    # Task Mutations
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
    assign_task = AssignTask.Field()
    delete_task = DeleteTask.Field()
