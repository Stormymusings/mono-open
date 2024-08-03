var REG_NONE = NewRegistrar("none");
var DNS_BIND = NewDnsProvider("bind");

D("exemplar.stormymusings.com", REG_NONE, DnsProvider(DNS_BIND), { no_ns: "true" },
    A("@", "192.0.2.1"),
    A("srv1", "192.0.2.2"),
END);
