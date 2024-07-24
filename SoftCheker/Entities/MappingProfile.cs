using AutoMapper;
using SoftCheker.Server.Entities;
using SoftCheker.Server.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Soft, SoftDTO>()
            .ForMember(dest => dest.EOLBasicSupport, opt => opt.MapFrom(src => src.BasicSupport))
            .ForMember(dest => dest.EOLExtendedSupport, opt => opt.MapFrom(src => src.ExtendedSupport))
            .ForMember(dest => dest.EOLNextVersion, opt => opt.MapFrom(src => src.NextVersion));

        CreateMap<SoftDTO, Soft>()
            .ForMember(dest => dest.BasicSupport, opt => opt.MapFrom(src => src.EOLBasicSupport))
            .ForMember(dest => dest.ExtendedSupport, opt => opt.MapFrom(src => src.EOLExtendedSupport))
            .ForMember(dest => dest.NextVersion, opt => opt.MapFrom(src => src.EOLNextVersion))
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<SmtpConfig, SmtpConfigDTO>()
            .ReverseMap()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<Domain, DomainDTO>()
            .ForMember(dest => dest.ExpiredDate, opt => opt.MapFrom(src => src.ExpiredDate));

        CreateMap<DomainDTO, Domain>()
            .ForMember(dest => dest.ExpiredDate, opt => opt.MapFrom(src => src.ExpiredDate))
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<Cert, CertDTO>()
            .ForMember(dest => dest.ExpiredDate, opt => opt.MapFrom(src => src.ExpiredDate))
            .ForMember(dest => dest.IssuedDate, opt => opt.MapFrom(src => src.IssuedDate));

        CreateMap<CertDTO, Cert>()
            .ForMember(dest => dest.ExpiredDate, opt => opt.MapFrom(src => src.ExpiredDate))
            .ForMember(dest => dest.IssuedDate, opt => opt.MapFrom(src => src.IssuedDate))
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<Contract, ContractDTO>()
           .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate))
           .ForMember(dest => dest.RenewDate, opt => opt.MapFrom(src => src.RenewDate))
           .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate));

        CreateMap<ContractDTO, Contract>()
          .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate))
          .ForMember(dest => dest.RenewDate, opt => opt.MapFrom(src => src.RenewDate))
          .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate))
          .ForMember(dest => dest.Id, opt => opt.Ignore());

    }
}
