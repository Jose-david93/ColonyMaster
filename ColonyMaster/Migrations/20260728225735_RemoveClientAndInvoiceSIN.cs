using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColonyMaster.Migrations
{
    /// <inheritdoc />
    public partial class RemoveClientAndInvoiceSIN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromSIN",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "SoldSIN",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "SIN",
                table: "Clients");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FromSIN",
                table: "Invoices",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SoldSIN",
                table: "Invoices",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SIN",
                table: "Clients",
                type: "longtext",
                nullable: true);
        }
    }
}
