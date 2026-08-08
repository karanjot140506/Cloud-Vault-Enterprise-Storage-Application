import { useState, useCallback } from "react";

export const useFolderNavigation = () => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [path, setPath] = useState([{ id: null, name: "My Files" }]);

  const navigateToFolder = useCallback((folder) => {
    setCurrentFolderId(folder.id);
    setPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  }, []);

  const navigateToBreadcrumb = useCallback((index) => {
    setPath((prev) => {
      const newPath = prev.slice(0, index + 1);
      setCurrentFolderId(newPath[newPath.length - 1].id);
      return newPath;
    });
  }, []);

  const navigateToRoot = useCallback(() => {
    setCurrentFolderId(null);
    setPath([{ id: null, name: "My Files" }]);
  }, []);

  return { currentFolderId, path, navigateToFolder, navigateToBreadcrumb, navigateToRoot };
};