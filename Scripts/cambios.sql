ALTER TABLE dbo.PlaylistTrack ADD PlaylistTrackId int identity(1, 1) NOT NULL;

ALTER TABLE [dbo].[PlaylistTrack] DROP CONSTRAINT PK_PlaylistTrack;

ALTER TABLE [dbo].[PlaylistTrack] ADD  CONSTRAINT [PK_PlaylistTrack] PRIMARY KEY CLUSTERED 
(
	[PlaylistTrackId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

insert into [User] ([Email], [FirstName], [LastName], [Password], [Roles])
values ('alexrod2121@gmail.com', 'Alexander', 'Rodriguez', 'password', 'Admin')