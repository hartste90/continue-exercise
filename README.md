# Package Manager - Steve Hart

## Approach
Thanks for the exercise.  The key considerations for this were:
1. how to fetch the dependencies of each package
2. recursively fetch the sub dependencies
3. protecting against duplicate dependencies/versions

   
--

1. For fetching the dependencies the code creates a synchronous process to leverage NPMs ability to fetch the most up to date information on it's packages including their dependencies.  I did not include peerDependencies or devDependeincies in the solution but those would be trivial to include if needed.
2. Recursively fetching the subdependencies is self-explanatory but is needed to make sure not just the top-level dependencies were included.
3. **Some packages may depend on the same thrid package so may have been listed twice (possibly with different version requirments).  To solve this you could hash the included packages with their versions and update the version if a newer version was required by any of the packages needed by the project.  However I didn't think including a library to compare semantic versions from NPM was in the scope of this task so I didn't do that, but here is such a library if we wanted to do that which I have used before: https://www.npmjs.com/package/semver

Thanks,
Steve H
