# Custom image for CircleCI


This is a custom image built on top of `cimg/base`. The general idea is to take
advantage of CircleCI's known working base image image and add the tools this
project requires for full CI/CD integration.

Could I simply use their orbs? Sure. But this gives more granular control.
This image will likely be built on top of a base ubuntu or debian image in the
future.

<br>

## Software & Tools

__OpenTofu__

Fork of Terraform by the Linux Foundation, used for provioning cloud resources
such as compute instances, load balancers, WAFs, managed databases, and more.

__Ansible__

Configure cloud compute instances & configuration management for applications.

Container orchestration tooling is possible, but needlessly complex for the
purposes of this project. Ansible is sufficient for managing independent Docker
hosts.

__SOPS__

Tool used for secrets management in this project.

__DNSControl__

IaC tooling for managing public & private DNS and registrars from
version-controlled files in this repository.

<br>


# Building this image

This image is built via Github Actions and stored as a package in this project's
repository.  
CircleCI pulls this image to use as the ephemeral execution environment for all
CI/CD tooling listed above.

<br>

## Taskfiles

To build the image locally, execute the following task in the root directory of
this repository.

```
task docker:cideploy:build
```

> Build types of `current` and `devel` are available for this image and
> controlled via environment variable.  
> `export CIDEPLOY_BUILD_TYPE=devel`

<br>

## Versioning & Workflow

While it would be possible to implement a version number auto-incrementing
process for this image, the added complexity is not needed or desired. Manual
version bumping is quite sufficient.


### Version file

The Taskfile reads version information from `version.json` while building using
`v1/build/Dockerfile.`

- For current builds, the image is tagged and pushed as both :latest and with
its specific version. (e.g. `cideploy:1.0.0` and `cideploy:latest` )

- For development builds, the image is tagged and pushed as :latest-dev as well
as with its specific version. (e.g. `cideploy:1.0.0-dev` and
`cideploy:latest-dev`)

### Development workflow

> Note that GitHub Actions only triggers this build process if a file in this subdirectory
(`/apps/cideploy/**`) is modified regardless of branch, pull request, or other
possible trigger. This includes manual dispatch.

__Development build job__

- Triggered on every push to a pull request targeting the main branch
- Builds and pushes a tagged dev image

__Production build job__

- Triggered only when a pull request to the main branch is merged
- Compares `next` and `current` version numbers in version.json to check for a
version bump
- Builds and pushes a new production image with the `next` version number
- Updates the `current` version number in version.json with the new production
image version
- Commits and pushes the updated version.json back to main

#### How to Work with the Image

__1. Create a new branch__

1. Create a new branch
1. Bump the `next` version number in `version.json`
1. Open a pull request

__2. Development Cycle__

1. Bump the `devel` version number in `version.json`
1. Push commits to the pull request to trigger development builds

__3. Merge to Main__

1. Merge the pull request to trigger the production build

<br>

# Refs

1. [https://taskfile.dev/](https://taskfile.dev/)
1. [https://github.com/getsops/sops](https://github.com/getsops/sops)
1. [https://docs.ansible.com/core.html](https://docs.ansible.com/core.html)
1. [https://opentofu.org/](https://opentofu.org/)
1. [https://dnscontrol.org/](https://dnscontrol.org/)
1. [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
1. [https://circleci.com/](https://circleci.com/)
1. [CirclCI - cimg/base](https://circleci.com/developer/images/image/cimg/base)

