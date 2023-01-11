namespace API.Extensions.Common
{
  public static class IEnumerableExtensions
  {
    public static bool ContainsDuplicates<T>(this IEnumerable<T> enumerable)
    {
      HashSet<T> knownElements = new();

      foreach (T element in enumerable)
      {
        if (!knownElements.Add(element))
        {
          return true;
        }
      }
      return false;
    }

    public static bool ContainsDuplicateWithLinq<T>(IEnumerable<T> collection)
    {
      return collection.GroupBy(x => x).Any(g => g.Count() > 1);
    }
  }
}