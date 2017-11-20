﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Chinook.UnitOfWork;
using Chinook.Repositories.Dapper.Chinook;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Chinook.WebApi.Authentication;

namespace Chinook.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IUnitOfWork>
                (
                    options => new ChinookUnitOfWork
                        (
                            Configuration.GetConnectionString("Chinook")
                        )
                );

            services.AddMvc();
            //services.AddMvc().AddFluentValidation();
            //services.AddTransient<IValidator<Customer>, CustomerValidator>();

            services.AddResponseCompression();
            services.Configure<GzipCompressionProviderOptions>
                (
                    options => options.Level = CompressionLevel.Optimal
                );

            var tokenProvider = new RsaJwtTokenProvider("issuer", "audience", "token_chinook_2017");
            services.AddSingleton<ITokenProvider>(tokenProvider);
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
                    options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.TokenValidationParameters = tokenProvider.GetValidatorParameters();
                    }
                );

            // esto usado para cuando se usa el DataAnnotation [Authorize]
            services.AddAuthorization(
                    auth =>
                    {
                        auth.DefaultPolicy = new AuthorizationPolicyBuilder()
                        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                        .RequireAuthenticatedUser()
                        .Build();
                    }
                );

            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(option =>
            {
                option.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
            });

            app.UseResponseCompression();            app.UseAuthentication();

            app.UseMvc();
        }
    }
}
