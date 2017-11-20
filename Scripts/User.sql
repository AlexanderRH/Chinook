USE [Chinook]

CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NOT NULL,
	[Password] [varchar](20) NOT NULL,
	[Roles] [varchar](50) NOT NULL
) ON [PRIMARY]

GO
