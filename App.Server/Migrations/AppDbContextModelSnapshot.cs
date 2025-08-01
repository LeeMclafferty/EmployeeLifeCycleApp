﻿// <auto-generated />
using System;
using App.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace App.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("App.Server.Models.AssignedTask", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime?>("CompletedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsComplete")
                        .HasColumnType("bit");

                    b.Property<int>("NewHireId")
                        .HasColumnType("int");

                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TaskTemplateId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TaskTemplateId");

                    b.ToTable("AssignedTask");
                });

            modelBuilder.Entity("App.Server.Models.Department", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Departments");
                });

            modelBuilder.Entity("App.Server.Models.PersonRecord", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("DepartmentId")
                        .HasColumnType("int");

                    b.Property<int?>("DeskNumber")
                        .HasColumnType("int");

                    b.Property<string>("EmailAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Initials")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsFullyRemote")
                        .HasColumnType("bit");

                    b.Property<string>("JobLevel")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("JobTitle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MiddleName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Phase")
                        .HasColumnType("int");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PreferredName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("TeamId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.HasIndex("TeamId");

                    b.ToTable("PersonRecords");
                });

            modelBuilder.Entity("App.Server.Models.TaskTemplate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsAutomated")
                        .HasColumnType("bit");

                    b.Property<int?>("OwningDepartmentId")
                        .HasColumnType("int");

                    b.Property<int?>("OwningTeamId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("taskPhase")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OwningDepartmentId");

                    b.HasIndex("OwningTeamId");

                    b.ToTable("TaskTemplates");
                });

            modelBuilder.Entity("App.Server.Models.Team", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("DepartmentId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("DepartmentTaskTemplate", b =>
                {
                    b.Property<int>("ApplicableDepartmentsId")
                        .HasColumnType("int");

                    b.Property<int>("TaskTemplateId")
                        .HasColumnType("int");

                    b.HasKey("ApplicableDepartmentsId", "TaskTemplateId");

                    b.HasIndex("TaskTemplateId");

                    b.ToTable("TaskTemplateApplicableDepartments", (string)null);
                });

            modelBuilder.Entity("App.Server.Models.AssignedTask", b =>
                {
                    b.HasOne("App.Server.Models.TaskTemplate", "TaskTemplate")
                        .WithMany()
                        .HasForeignKey("TaskTemplateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TaskTemplate");
                });

            modelBuilder.Entity("App.Server.Models.PersonRecord", b =>
                {
                    b.HasOne("App.Server.Models.Department", "Department")
                        .WithMany()
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("App.Server.Models.Team", "Team")
                        .WithMany()
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Department");

                    b.Navigation("Team");
                });

            modelBuilder.Entity("App.Server.Models.TaskTemplate", b =>
                {
                    b.HasOne("App.Server.Models.Department", "OwningDepartment")
                        .WithMany()
                        .HasForeignKey("OwningDepartmentId");

                    b.HasOne("App.Server.Models.Team", "OwningTeam")
                        .WithMany()
                        .HasForeignKey("OwningTeamId");

                    b.Navigation("OwningDepartment");

                    b.Navigation("OwningTeam");
                });

            modelBuilder.Entity("App.Server.Models.Team", b =>
                {
                    b.HasOne("App.Server.Models.Department", "Department")
                        .WithMany()
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("DepartmentTaskTemplate", b =>
                {
                    b.HasOne("App.Server.Models.Department", null)
                        .WithMany()
                        .HasForeignKey("ApplicableDepartmentsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("App.Server.Models.TaskTemplate", null)
                        .WithMany()
                        .HasForeignKey("TaskTemplateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
