import TechniqueList from '../techniques/TechniqueList';
import { TECHNIQUES_INDOOR, CATEGORY_TAGS_INDOOR } from '../techniques/data';

export default function GuideTechniquesDeBase() {
  return (
    <TechniqueList
      items={TECHNIQUES_INDOOR}
      categoryTags={CATEGORY_TAGS_INDOOR}
      namespace="techniques"
    />
  );
}
