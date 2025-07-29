namespace App.Server.Models
{
    public class CreateTaskTemplateRequest
    {
        public TaskTemplate? TaskTemplate { get; set; }
        public List<int>? DepartmentIds { get; set; }
    }
}
