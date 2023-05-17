export type Mapper<Domain, Model, Dto> = {
	toDomain(item: Model): Domain;
	toModel(item: Domain): Model;
	toDto(item: Domain): Dto;
};
