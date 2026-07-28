using Microsoft.AspNetCore.Diagnostics;
using ColonyMaster.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddIdentityAndAuth(builder.Configuration);
builder.Services.AddApiDocs();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ColonyMaster API V1");
    });
}
else
{
    // Without this, an unhandled exception aborts the response before CORS
    // headers are written, so the browser reports a CORS error instead of the real 500.
    app.UseExceptionHandler(errApp => errApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        app.Logger.LogError(feature?.Error, "Unhandled exception processing {Path}", context.Request.Path);
        await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred." });
    }));
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.MigrateAndSeedAsync();

app.Run();
