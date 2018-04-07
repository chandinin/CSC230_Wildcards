CREATE TABLE ProposalStatus (
	[StatusId] INT NOT NULL,
	[Description] varchar(50) NOT NULL,
	CONSTRAINT [PK_ProposalStatus] PRIMARY KEY ([StatusId]),
	CONSTRAINT [FK_ProposalStatus_StatusId] FOREIGN KEY ([StatusId]) REFERENCES Proposal ([Status])
);