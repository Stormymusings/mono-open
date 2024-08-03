# This should be migrated to ubuntu:22.04 ... eventually.
FROM cimg/base:2024.07 AS base


#####################################
## Image Labels
# ---
LABEL org.opencontainers.image.source="https://github.com/Stormymusings/mono-open"
LABEL org.opencontainers.image.description="Stormy Musings custom CI deploy environment"


#####################################
## Build Args
# ---
ARG ANSIBLE_VERSION
ARG ANSIBLE_LINT_VERSION
ARG MITOGEN_VERSION
ARG JMESPATH_VERSION
ARG PYWINRM_VERSION
ARG TASK_VERSION
ARG SOPS_VERSION
ARG DNSCONTROL_VERSION


#####################################
## Package maintenance & Install tools
# ---
# Change user & install
USER root
RUN apt-get update && \
    apt-get install -y python3-pip


#####################################
## Install Ansible (core) & dependencies
# ---
# Change user & install
USER circleci
RUN pip3 install --upgrade pip cffi && \
    pip3 install \
        ansible-core==${ANSIBLE_VERSION} \
        ansible-lint==${ANSIBLE_LINT_VERSION} \
        mitogen==${MITOGEN_VERSION} \
        jmespath==${JMESPATH_VERSION} \
        pywinrm==${PYWINRM_VERSION} && \
    rm -rf ~/.cache/pip

# Clean APT cache
USER root
RUN apt-get clean && rm -rf /var/lib/apt/lists/*


#####################################
## Install Go Task
# ---
# Change user & Install
USER circleci
RUN curl --location https://taskfile.dev/install.sh | \
    sh -s -- -b ~/bin/ -d v${TASK_VERSION}


#####################################
## Install SOPS
# ---
# Create temp builder layer
FROM base AS builder_sops
WORKDIR /tmp/builder

# Change user & Install
USER root
RUN dpkg --print-architecture > arch && \
    curl -LO https://github.com/mozilla/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.linux.`cat arch` && \
    chmod +x sops-v${SOPS_VERSION}.linux.`cat arch` && \
    mv sops-v${SOPS_VERSION}.linux.`cat arch` /bin/sops


#####################################
## Install DNSControl
# ---
# Create temp builder layer
FROM base AS builder_dnscontrol
WORKDIR /tmp/builder

# Change user & Install
USER root
RUN wget https://github.com/StackExchange/dnscontrol/releases/download/v${DNSCONTROL_VERSION}/dnscontrol-${DNSCONTROL_VERSION}.amd64.deb -O /tmp/dnscontrol.deb && \
    dpkg -i /tmp/dnscontrol.deb && \
    rm /tmp/dnscontrol.deb

#####################################
## Create staging layer
# ---
FROM base AS staging
COPY --from=builder_sops /bin/sops /bin/sops
COPY --from=builder_dnscontrol /usr/bin/dnscontrol /usr/bin/dnscontrol


#####################################
## Create release layer
# ---
FROM staging AS release
USER circleci
