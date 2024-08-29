import fs from "fs";
import { Dependency } from "../types";
import { installPackages } from "../util/download";
import { nodeModulesPath, packageJsonPath } from "../util/paths";
import { execSync } from "child_process";

export async function installAllDependencies() {
  console.log("Installing dependencies...");

  // Delete the node_modules folder if it exists - we always install from scratch
  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true });
  }
  fs.mkdirSync(nodeModulesPath);

  // Get top-level dependencies from package.json
  const topLevelDependencies = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  ).dependencies;

  // -------------------------------------------------
  // TODO -> Determine the full list of dependencies to download

  function getAllDependencies(): Dependency[] {
    const dependencies: Dependency[] = [];

    //extracts dependencies from an object of dependencies with versions
    function extractDependencies(deps: Dependency) {
      if (!deps) return;
      //iterate over all listed dependencies
      for (const [name, version] of Object.entries(deps || {})) {
        dependencies.push({ name, version });
        //create a synchronous process to use npm to get its metadata
        const npmView = execSync(`npm view ${name}@${version} --json`, {
          encoding: "utf8",
        });
        //parse out the dependencies of that package
        const parsedDependencies = JSON.parse(npmView).dependencies;
        //recursively extract dependencies
        extractDependencies(parsedDependencies);
      }
    }

    //iterate over topLevelDependencies and extract subdependencies
    extractDependencies(topLevelDependencies);

    return dependencies;
  }

  const dependenciesToDownload = getAllDependencies();

  // const dependenciesToDownload: Dependency[] = [
  //   { name: "is-thirteen", version: "2.0.0" },
  // ];
  // -------------------------------------------------

  await installPackages(dependenciesToDownload);
}
