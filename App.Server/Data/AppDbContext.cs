using App.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            :base(options)
        {

        }

        public DbSet<PersonRecord> PersonRecords { get; set; }
    }
}
