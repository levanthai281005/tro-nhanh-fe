import { Bell, Camera, Home } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-1 justify-center gap-8 px-6">
        <View className="self-start rounded-md bg-cream px-4 py-2">
          <Text className="font-semibold text-primary">TRỌ NHANH · NGƯỜI Ở</Text>
        </View>

        <View className="gap-3">
          <Text className="text-4xl font-bold text-ink">Mọi việc ở trọ trong một nơi.</Text>
          <Text className="text-lg leading-7 text-ink-muted">
            Theo dõi hóa đơn, gửi sự cố và nhận thông báo từ chủ trọ.
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex-row items-center gap-3 rounded-lg border border-line bg-cream p-4">
            <Home color="#8A4A20" size={22} />
            <Text className="font-medium text-ink">Thông tin nơi ở</Text>
          </View>
          <View className="flex-row items-center gap-3 rounded-lg border border-line bg-cream p-4">
            <Camera color="#8A4A20" size={22} />
            <Text className="font-medium text-ink">Báo sự cố bằng hình ảnh</Text>
          </View>
          <View className="flex-row items-center gap-3 rounded-lg border border-line bg-cream p-4">
            <Bell color="#8A4A20" size={22} />
            <Text className="font-medium text-ink">Nhắc hạn và thông báo</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
